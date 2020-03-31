import { Component } from '@angular/core';
import { google } from 'googleapis';
import { StorageMap } from '@ngx-pwa/local-storage';
import { HttpClient } from '@angular/common/http';

// Calendar API credentials
import credentials from './credentials.json';

export interface CalendarCredentials {
  installed: {
    "client_id": string, 
    "project_id": string,
    "auth_uri": string,
    "token_uri": string,
    "auth_provider_x509_cert_url": string,
    "redirect_uris": Array<string>
  }
}

export interface CalendarEvent {
  "kind": string,
  "etag": string,
  "id": string,
  "status": string,
  "htmlLink": string,
  "created": Date,
  "updated": Date,
  "summary": string,
  "description": string,
  "location": string,
  "colorId": string,
  "creator": {
    "id": string,
    "email": string,
    "displayName": string,
    "self": boolean
  },
  "organizer": {
    "id": string,
    "email": string,
    "displayName": string,
    "self": boolean
  },
  "start": {
    "date": Date,
    "dateTime": Date,
    "timeZone": string
  },
  "end": {
    "date": Date,
    "dateTime": Date,
    "timeZone": string
  },
  "endTimeUnspecified": boolean,
  "recurrence": Array<string>,
  "recurringEventId": string,
  "originalStartTime": {
    "date": Date,
    "dateTime": Date,
    "timeZone": string
  },
  "transparency": string,
  "visibility": string,
  "iCalUID": string,
  "sequence": number,
  "attendees": [
    {
      "id": string,
      "email": string,
      "displayName": string,
      "organizer": boolean,
      "self": boolean,
      "resource": boolean,
      "optional": boolean,
      "responseStatus": string,
      "comment": string,
      "additionalGuests": number
    }
  ],
  "attendeesOmitted": boolean,
  "extendedProperties": {
    "private": {
      "key": string
    },
    "shared": {
      "key": string
    }
  },
  "hangoutLink": string,
  "conferenceData": {
    "createRequest": {
      "requestId": string,
      "conferenceSolutionKey": {
        "type": string
      },
      "status": {
        "statusCode": string
      }
    },
    "entryPoints": [
      {
        "entryPointType": string,
        "uri": string,
        "label": string,
        "pin": string,
        "accessCode": string,
        "meetingCode": string,
        "passcode": string,
        "password": string
      }
    ],
    "conferenceSolution": {
      "key": {
        "type": string
      },
      "name": string,
      "iconUri": string
    },
    "conferenceId": string,
    "signature": string,
    "notes": string,
    "gadget": {
      "type": string,
      "title": string,
      "link": string,
      "iconLink": string,
      "width": number,
      "height": number,
      "display": string,
      "preferences": {
        "key": string
      }
    },
    "anyoneCanAddSelf": boolean,
    "guestsCanInviteOthers": boolean,
    "guestsCanModify": boolean,
    "guestsCanSeeOtherGuests": boolean,
    "privateCopy": boolean,
    "locked": boolean,
    "reminders": {
      "useDefault": boolean,
      "overrides": [
        {
          "method": string,
          "minutes": number
        }
      ]
    },
    "source": {
      "url": string,
      "title": string
    },
    "attachments": [
      {
        "fileUrl": string,
        "title": string,
        "mimeType": string,
        "iconLink": string,
        "fileId": string
      }
    ]
  }
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  dates: Array<CalendarEvent>;

  constructor(private storage: StorageMap, private http: HttpClient) {
    
    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
    const TOKEN_NAME = 'calendar_api_token';
    
    // Load client secrets from a local file.
    authorize(credentials, this.listEvents);
    
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials: CalendarCredentials, callback?: any): void {
      const oAuth2Client = new google.auth.OAuth2(
        credentials.installed.client_id, null, credentials.installed.redirect_uris[0]);
    
      // Check if we have previously stored a token.
      storage.get(TOKEN_NAME).toPromise().then((token) => {
        oAuth2Client.setCredentials(token);
        callback(oAuth2Client);
      }).catch((err) => {
        getAccessToken(oAuth2Client, callback);
      })
    }
    
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getAccessToken(oAuth2Client: any, callback?: any) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });
      http.get<string>(authUrl).toPromise().then((code) => {
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return console.error('Error retrieving access token', err);
          oAuth2Client.setCredentials(token);
          storage.set(TOKEN_NAME, token);
          callback(oAuth2Client);
        });
      })
    }
    
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  listEvents(auth: any): void {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.dates = new Array<CalendarEvent>();
        res.data.items.map((e, i, a) => {
          let newEvent: CalendarEvent = null;
          for (let key in e) {
            if (e.hasOwnProperty(key)) {
              newEvent[key] = e[key];
            }
          }
          this.dates.push(newEvent);
        })
      }
    })
  }

}
