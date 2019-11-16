class ArticlesChannel < ApplicationCable::Channel
  def subscribed
    stream_from "articles_channel"
  end

  def unsubscribed
  end
end
