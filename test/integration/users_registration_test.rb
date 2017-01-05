require 'test_helper'

class UsersRegistrationTest < ActionDispatch::IntegrationTest

  test "invalid registration information" do
    get register_path
    assert_no_difference 'User.count' do
      post users_path, params: { user: { email: "invalid_user@test.com",
                                         password:              "password",
                                         password_confirmation: "abc123" } }
    end
    assert_template 'users/new'
  end
end
