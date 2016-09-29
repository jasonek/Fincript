class UsersController < ApplicationController
  # before_action :authorize, only: [:dashboard]

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id #log in new users when they register successfully
      redirect_to root_url, notice: "Thank you for registering."
    else
      render "new"
    end
  end

  def save_data
    encoutputstring = params.first[0]
    # encoded_string = Base64.encode64(encoutputstring)
    current_user.data = encoutputstring
    # myhash = eval(encoutputstring)
    # current_user.data = myhash[:ct]
    # current_user.iv = myhash[:iv]
    current_user.save
    # redirect_to '/dashboard'
  end

  private

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation, :data)
    end
end
