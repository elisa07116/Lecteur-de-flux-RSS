class Api::V1::BaseController < ApplicationController
  skip_before_action :verify_authenticity_token
  
  private

  def render_error(message, status = :unprocessable_entity)
    render json: { error: message }, status: status
  end

  def render_success(data, status = :ok)
    render json: data, status: status
  end
end 