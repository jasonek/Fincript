class User < ApplicationRecord
  # include Encryption
  # attr_encryptor :email, key: ENV["EMAIL_ENC_ATTR"]#, algorithm: 'aes-256-gcm', mode: :per_attribute_iv, encode: true, encode_iv: true, encode_salt: true
  has_secure_password

  validates :email, presence: true, uniqueness: true, length: {:minimum => 5, :maximum => 99}, format: { with: /.+@.+\..+/i } #all I check for is the @ and a dot
  # validates :password, length: {minimum: 8}
  before_create { generate_token(:remember_token) }

  def generate_token(column)
    begin
      self[column] = SecureRandom.urlsafe_base64
    end while User.exists?(column => self[column])
  end

  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_token, User.token(remember_token))
  end

  def authenticated?(remember_token)
    return false if remember_token.nil?
    BCrypt::Password.new(remember_token).is_password?(remember_token)
  end

  def forget
    update_attribute(:remember_token, nil)
  end

end
