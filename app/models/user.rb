class User < ApplicationRecord
  # include Encryption
  # attr_encrypted :email, key: :encryption_key, algorithm: 'aes-256-gcm', mode: :per_attribute_iv, encode: true, encode_iv: true, encode_salt: true
  has_secure_password

  validates :email, presence: true, uniqueness: true

  # def encryption_key #ONLY FOR DEVELOPMENT
    #  "3c0dc2a239ab9eeaba4168ff82b93b2c521f731c690c4be195196069efc8127eadcd84a92c6c3f45c2f459ea33ba4dea131381a6087223f744f8edfc78937be6429e947df6067a4470661afc6ae9e8cbca2b435b23291dac71ff12178b2889cda736694a80b4467e862026a02607449e7fc94f060f867b5174f7d1a6154f7c9e2a039972be63d3ada63630e39939fb58d7931899dfb9e56ed8d78910da5ec5310d9950503a6effbec671b624c8d46ee8e159521127ca3165bd3ebd48ece839eada6d16ddba05f55712e20433a18437bc3e1e5021b50d433fce2ab9bee4272de16e2e7afa68a1c142f327fb6f0f3e254062c9a66358508bf2dd95b75522bdbb84" #generated in 'rails console' with SecureRandom.hex(256)
  # end
end
