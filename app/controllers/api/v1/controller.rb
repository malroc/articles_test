class Api::V1::Controller < ActionController::Base
  skip_before_action :verify_authenticity_token
  respond_to :json
end
