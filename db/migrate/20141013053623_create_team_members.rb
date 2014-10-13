class CreateTeamMembers < ActiveRecord::Migration
  def change
    create_table :team_members do |t|
      t.string :name
      t.text :description
      t.string :picture
      t.string :nickname
    end
  end
end
