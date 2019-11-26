class Api::V1::ArticlesController < Api::V1::Controller
  def index
    search_by_name = params[:search_by_name].presence
    search_by_text = params[:search_by_text].presence
    group_by = params[:group_by].presence
    sort_by = params[:sort_by].presence

    if search_by_name && search_by_text
      @articles =
        Article.where("name like ? and text like ?",
                      "%#{search_by_name}%",
                      "%#{search_by_text}%")
    elsif search_by_name
      @articles = Article.where("name like ?", "%#{search_by_name}%")
    elsif search_by_text
      @articles = Article.where("text like ?", "%#{search_by_text}%")
    else
      @articles = Article.all
    end

    respond_with response_data(@articles, group_by, sort_by)
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

  def response_data(articles, group_by, sort_by)
    res =
      if group_by
        articles.group_by { |a| a.read_attribute(group_by) }
      else
        {all: articles}
      end

    res.map do |k, v|
      v = v.sort_by { |a| a.read_attribute(sort_by) } if sort_by

      counts_by_type =
        v.
          group_by(&:article_type).
          map { |k, v| {article_type: k, count: v.count} }

      list =
        v.map do |a|
          {id: a.id,
           name: a.name,
           text: a.text,
           article_type: a.article_type,
           story_name: a.story.name}
        end

      {key: k, list: list, count: list.count, counts_by_type: counts_by_type}
    end
  end
end
