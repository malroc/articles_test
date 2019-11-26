class Api::V1::StoriesController < Api::V1::Controller
  def index
    @stories = Story.all

    respond_with :api, :v1, @stories
  end
end
