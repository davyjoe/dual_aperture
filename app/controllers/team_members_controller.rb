class TeamMembersController < ApplicationController
  respond_to :json, :only => [:show]

  def show
    @team_member = TeamMember.find(params[:id])
    respond_with @team_member
  end
end