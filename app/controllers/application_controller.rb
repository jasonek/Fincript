class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include SessionsHelper
  
  private
  def current_user
    @current_user ||= User.find_by(remember_token: cookies[:remember_token]) if cookies[:remember_token]
  end
  helper_method :current_user

  def authorize
    current_user
    redirect_to login_url, alter: "You do not have access" if @current_user.nil?
  end
end
