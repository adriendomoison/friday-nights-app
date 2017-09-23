import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';
import {AccountService} from '../../services/account.service';
import {Profile, ProfileService} from '../../services/profile.service';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [ProfileService],
})
export class ProfilePage {

  profile: Profile;
  edit_description: boolean;

  constructor(public navCtrl: NavController,
              private accountService: AccountService,
              private profileService: ProfileService) {
    this.edit_description = false;
    this.profile = new Profile()
  }

  ngOnInit() {
    this.accountService.getCurrentUser()
      .then(user => {
        this.profileService.getProfile(user.profile_public_id)
          .then(profile => {
            this.profile = profile;
          });
      });
  }

  editDescription(): void {
    this.edit_description = false;
    this.profileService.updateProfile(this.profile).then()
  }

}
