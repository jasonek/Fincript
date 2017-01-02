class User < ApplicationRecord
  # include Encryption
  # attr_encryptor :email, key: ENV["EMAIL_ENC_ATTR"]#, algorithm: 'aes-256-gcm', mode: :per_attribute_iv, encode: true, encode_iv: true, encode_salt: true
  has_secure_password

  validates :email, presence: true, uniqueness: true, length: {:minimum => 5, :maximum => 99}, format: { with: /.+@.+\..+/i } #all I check for is the @ and a dot
  # validates :password, length: {minimum: 8}

end
