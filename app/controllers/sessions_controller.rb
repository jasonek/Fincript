class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by_email(params[:email])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to dashboard_path, notice: "Logged in successfully. Now you must decrypt"
    else
      flash.now.alert = "Email or password is invalid"
      render "new"
    end
  end

  def dashboard
    @data = current_user.data
  end

  def api
    apidata = current_user.data
    render text: apidata
  end

  def destroy
    session[:user_id] = nil
    # reset_session ?
    redirect_to root_url, notice: "Logged out. Please close the browser window now"
  end
end
