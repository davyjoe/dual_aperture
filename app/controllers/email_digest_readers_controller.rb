class EmailDigestReadersController < ApplicationController
  def create
    reader = EmailDigestReader.new(email: params[:email_digest_reader][:email])

    if reader.save
      render :js => "alert('Signup successful!')"
    else
      render :js => "alert(\"#{reader.errors.full_messages.join('. ')}\")"
    end
  end

  private 

  def email_digest_reader_params
    params.require(:email_digest_reader).permit(:email)
  end
end
