require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest

  def setup
    @user       = users(:user_1)
    @other_user = users(:user_2)
  end

  test "users#index should work and be root" do
    get users_path
    assert_response :success

    get home_path
    assert_response :success
  end

end
