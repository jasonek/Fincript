class SessionsController < ApplicationController
  before_action :authorize, except: [:new, :create, :destroy]

  def new #sends to Login page
  end

  def unlock #sends to Unlock page
  end

  def create #creates new session if user & password are legit
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      log_in user
      if params[:session][:remember_me]
        cookies.permanent[:remember_token] = user.remember_token
      else
        cookies[:remember_token] = user.remember_token
      end
      redirect_to unlock_path
    else
      flash.now.alert = "Email or password is invalid"
      render "new"
    end
  end

  def dashboard #sends to dashboard
    @data = current_user.data
  end

  def api #used to get logged-in user's "data" field in the database
    apidata = current_user.data
    render text: apidata
  end

  def destroy
    log_out if logged_in?
    cookies.delete(:remember_token)
    reset_session
    redirect_to root_url, notice: "Logged out. Please close the browser window now"
  end
end
