class RtcTokenBuilder {
 static RoleAttendee = 0;
 static RolePublisher = 1;
 static RoleSubscriber = 2;
 static RoleAdmin = 101;

 static buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpireTs) {
  return RtcTokenBuilder.buildTokenWithUserAccount(appID, appCertificate, channelName, uid.toString(), role, privilegeExpireTs);
 }

 static buildTokenWithUserAccount(appID, appCertificate, channelName, userAccount, role, privilegeExpireTs) {
  const token = AccessToken.init(appID, appCertificate, channelName, userAccount);
  const Privileges = AccessToken.Privileges;

  token.addPrivilege(Privileges.kJoinChannel, privilegeExpireTs);

  if (role === RtcTokenBuilder.RoleAttendee || role === RtcTokenBuilder.RolePublisher || role === RtcTokenBuilder.RoleAdmin) {
   token.addPrivilege(Privileges.kPublishVideoStream, privilegeExpireTs);
   token.addPrivilege(Privileges.kPublishAudioStream, privilegeExpireTs);
   token.addPrivilege(Privileges.kPublishDataStream, privilegeExpireTs);
  }

  return token.build();
 }
}
