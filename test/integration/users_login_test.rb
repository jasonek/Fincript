require 'test_helper'

class UsersLoginTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:user_1)
  end

  test "login with invalid information" do
    get login_path
    assert_template 'sessions/new'
    post '/login', params: { session: { email: "", password: "" } }
    assert_template 'sessions/new'
    assert_not flash.empty?
    get root_path
    assert flash.empty?
  end

  test "login with valid information followed by logout" do
    get login_path
    assert_response :success
    post '/login', params: { session: { email: @user.email, password: 'abc123' } }
    assert_not cookies['remember_token'].empty?
    assert_redirected_to '/unlock'
    follow_redirect!
    assert_template 'sessions/unlock'
    #Once User is Logged in, Navbar options become:
    assert_select "a[href=?]", home_path
    assert_select "a[href=?]", login_path, count: 0 #after login, option should go away
    assert_select "a[href=?]", unlock_path
    assert_select "a[href=?]", dashboard_path
    assert_select "a[href=?]", logout_path
    get logout_path
    assert cookies['remember_token'].blank?
    assert_redirected_to root_url
    # Simulate a user clicking logout in a second window.
    get logout_path
    follow_redirect!
    assert_select "a[href=?]", home_path
    assert_select "a[href=?]", register_path
    assert_select "a[href=?]", login_path, count: 1
    assert_select "a[href=?]", logout_path,      count: 0 #after logout, option should go away
  end

end
