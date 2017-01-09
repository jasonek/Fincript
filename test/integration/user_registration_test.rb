require 'test_helper'

class UsersSignupTest < ActionDispatch::IntegrationTest

  test "invalid signup information" do
    get register_path
    assert_no_difference 'User.count' do
      post users_path, params: { user: { email: "user@invalid", password: "foo", password_confirmation: "bar" } }
    end
    assert_template 'users/new'
    assert_select 'div.error_messages'
    assert_select 'div.field_with_errors'
  end

  test "valid signup information" do
    get register_path
    assert_difference 'User.count', 1 do
      post users_path, params: { user: { email: "valid@valid.com", password: "abc123", password_confirmation: "abc123" } }
    end
    follow_redirect!
    assert_template 'sessions/dashboard'
  end

end
