class UsersController < ApplicationController
  before_action :authorize, except: [:index, :new, :create]

  def index
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      log_in @user
      redirect_to '/dashboard', notice: "Upload loan data to get started."
    else
      render "new"
    end
  end

  def save_data
    encoutputstring = params.first[0]
    current_user.data = encoutputstring
    current_user.save
    flash.clear
  end

  private

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation, :data)
    end
end
