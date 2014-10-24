class TeamMember < ActiveRecord::Base
  mount_uploader :picture, PictureUploader
end