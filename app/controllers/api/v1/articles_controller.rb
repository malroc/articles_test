class Api::V1::ArticlesController < Api::V1::Controller
  def index
    search = params[:search].presence
    group_by = params[:group_by].presence
    sort_by = params[:sort_by].presence

    unless ["name", "text", "article_type", "story_id"].include?(group_by)
      group_by = nil
    end

    if search
      @articles =
        Article.where("LOWER(name) LIKE :search OR LOWER(text) LIKE :search",
                      search: "%#{search.downcase}%")
    else
      @articles = Article.all
    end

    join_sql =
      if group_by
        <<-SQL
          JOIN (SELECT #{group_by}, COUNT(*) as articles_count,
            COUNT(DISTINCT article_type) as article_types_count
            FROM articles GROUP BY #{group_by}) s
          ON articles.#{group_by} = s.#{group_by}
        SQL
      else
        <<-SQL
          CROSS JOIN (SELECT COUNT(*) as articles_count,
            COUNT(DISTINCT article_type) AS article_types_count FROM articles) s
        SQL
      end

    @articles = @articles.joins(join_sql)

    if sort_by
      @articles = @articles.order(sort_by)
    end

    @articles =
      @articles.
        select("articles.*, s.articles_count, s.article_types_count").
        includes(:story)

    respond_with response_data(@articles.includes(:story), group_by)
  end

  def create
    @story = Story.where(name: params[:article][:story_name]).first_or_create
    @article = Article.new(article_params)
    @article.story = @story

    if @article.save
      ActionCable.server.broadcast("articles_channel", body: :article_created)
    end

    respond_with :api, :v1, @article
  end

  def destroy
    @article = Article.find(params[:id])
    @article.destroy

    ActionCable.server.broadcast("articles_channel", body: :article_destroyed)

    respond_with :api, :v1, @article
  end

  protected

  def article_params
    params.
      require(:article).
      permit(:name, :text, :article_type)
  end

  def response_data(articles, group_by)
    res =
      if group_by
        articles.group_by { |a| a.read_attribute(group_by) }
      else
        {all: articles}
      end

    res.map do |k, v|
      list =
        v.map do |a|
          {id: a.id,
           name: a.name,
           text: a.text,
           article_type: a.article_type,
           story_name: a.story.name}
        end

      {key: k,
       list: list,
       count: v.first&.articles_count,
       types_count: v.first&.article_types_count}
    end
  end
end
