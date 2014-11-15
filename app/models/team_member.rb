class TeamMember < ActiveRecord::Base
  mount_uploader :picture, PictureUploader
  scope :by_position, -> { order(:position) }
end