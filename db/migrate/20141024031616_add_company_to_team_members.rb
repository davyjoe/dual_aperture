class AddCompanyToTeamMembers < ActiveRecord::Migration
  def change
    add_column :team_members, :company, :string
  end
end
