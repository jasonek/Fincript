require 'test_helper'

class UsersRegistrationTest < ActionDispatch::IntegrationTest

  test "invalid registration information" do
    get register_path
    assert_no_difference 'User.count' do
      post users_path, params: { user: { email: "invalid_user@test.com", password: "password", password_confirmation: "abc123" } }
    end
    assert_template 'users/new'
    assert_select 'div.error_messages'
    assert_select 'div.field_with_errors'
  end

  test "valid registration information" do
    get register_path
    assert_difference 'User.count', 1 do
      post users_path, params: { user: { email: "valid_user@test.com", password: "abc123", password_confirmation: "abc123" } }
    end
    assert_redirected_to dashboard_url
    follow_redirect!
    assert_template 'sessions/unlock'
  end

end
