class AddPositionToTeamMembers < ActiveRecord::Migration
  def change
    add_column :team_members, :position, :integer
  end
end
