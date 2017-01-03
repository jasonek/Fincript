require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest

  def setup
    # login_as(users(:user_1))
    # session = {}
    # session[:user_id] = 1
    # @current_user = User.first #as of now is jason@jason.com
    # @current_user.authenticate('abc123')
  end

  test "login path should point to sessions#new" do
    get login_path
    assert_response :success
  end

  test "if no user is logged in, dashboard and unlock should redirect to login" do
    @current_user = nil
    get dashboard_path
    assert_redirected_to(controller: "sessions", action: "new")

    get unlock_path
    assert_redirected_to(controller: "sessions", action: "new")
  end

  # test "if user is logged in, dashboard and unlock pages should both work" do
  #   # @current_user = users(:user_1)
  #   # byebug
  #   get dashboard_path
  #   assert_redirected_to(controller: "sessions", action: "dashboard")
  #
  #   get unlock_path
  #   assert_redirected_to(controller: "sessions", action: "unlock")
  # end

end
