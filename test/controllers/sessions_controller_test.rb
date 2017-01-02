require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest
  test "login path should point to sessions#new" do
    get login_path
    assert_response :success
  end

end
