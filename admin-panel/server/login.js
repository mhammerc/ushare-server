Accounts.validateLoginAttempt(function(loginInfo)
{
	if(!loginInfo.allowed)
	{
		return false;
	}

	if(loginInfo.user.profile.role === 'admin')
	{
		return true;
	}

	return false;
});