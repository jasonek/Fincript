require 'test_helper'

class UsersDashboardTest < ActionDispatch::IntegrationTest

  def setup
    @user = users(:user_1)
  end

  test "dashboard display" do
    post '/login', params: { email: @user.email, password: 'abc123' }
    get dashboard_path
    assert :success
    assert_template 'sessions/dashboard'
    assert_select 'span', text: @user.email
    assert_select "a[href=?]", unlock_path
    assert_select "a[href=?]", dashboard_path
    assert_select "a[href=?]", logout_path
  end

end
