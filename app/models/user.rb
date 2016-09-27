class User < ApplicationRecord
  include Encryption
  attr_encrypted :email, :key => "TESTKEY"
  has_secure_password

  validates :email, presence: true, uniqueness: true
end
