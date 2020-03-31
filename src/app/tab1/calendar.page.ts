import { Component } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { HttpClient } from '@angular/common/http';

// Calendar API credentials
import { google } from 'googleapis';
import * as credentials from './credentials.json';

export interface CalendarCredentials {
  installed: {
    'client_id': string,
    'project_id': string,
    'auth_uri': string,
    'token_uri': string,
    'auth_provider_x509_cert_url': string,
    'redirect_uris': Array<string>
  };
}

export interface CalendarEvent {
  'kind': string;
  'etag': string;
  'id': string;
  'status': string;
  'htmlLink': string;
  'created': Date;
  'updated': Date;
  'summary': string;
  'description': string;
  'location': string;
  'colorId': string;
  'creator': {
    'id': string,
    'email': string,
    'displayName': string,
    'self': boolean
  };
  'organizer': {
    'id': string,
    'email': string,
    'displayName': string,
    'self': boolean
  };
  'start': {
    'date': Date,
    'dateTime': Date,
    'timeZone': string
  };
  'end': {
    'date': Date,
    'dateTime': Date,
    'timeZone': string
  };
  'endTimeUnspecified': boolean;
  'recurrence': Array<string>;
  'recurringEventId': string;
  'originalStartTime': {
    'date': Date,
    'dateTime': Date,
    'timeZone': string
  };
  'transparency': string;
  'visibility': string;
  'iCalUID': string;
  'sequence': number;
  'attendees': [
    {
      'id': string,
      'email': string,
      'displayName': string,
      'organizer': boolean,
      'self': boolean,
      'resource': boolean,
      'optional': boolean,
      'responseStatus': string,
      'comment': string,
      'additionalGuests': number
    }
  ];
  'attendeesOmitted': boolean;
  'extendedProperties': {
    'private': {
      'key': string
    },
    'shared': {
      'key': string
    }
  };
  'hangoutLink': string;
  'conferenceData': {
    'createRequest': {
      'requestId': string,
      'conferenceSolutionKey': {
        'type': string
      },
      'status': {
        'statusCode': string
      }
    },
    'entryPoints': [
      {
        'entryPointType': string,
        'uri': string,
        'label': string,
        'pin': string,
        'accessCode': string,
        'meetingCode': string,
        'passcode': string,
        'password': string
      }
    ],
    'conferenceSolution': {
      'key': {
        'type': string
      },
      'name': string,
      'iconUri': string
    },
    'conferenceId': string,
    'signature': string,
    'notes': string,
    'gadget': {
      'type': string,
      'title': string,
      'link': string,
      'iconLink': string,
      'width': number,
      'height': number,
      'display': string,
      'preferences': {
        'key': string
      }
    },
    'anyoneCanAddSelf': boolean,
    'guestsCanInviteOthers': boolean,
    'guestsCanModify': boolean,
    'guestsCanSeeOtherGuests': boolean,
    'privateCopy': boolean,
    'locked': boolean,
    'reminders': {
      'useDefault': boolean,
      'overrides': [
        {
          'method': string,
          'minutes': number
        }
      ]
    },
    'source': {
      'url': string,
      'title': string
    },
    'attachments': [
      {
        'fileUrl': string,
        'title': string,
        'mimeType': string,
        'iconLink': string,
        'fileId': string
      }
    ]
  };
}

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss']
})
export class CalendarPage {

  dates: Array<CalendarEvent>;
  private TOKEN_NAME = 'calendar_token';
  private SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];


  constructor(private storage: StorageMap, private http: HttpClient) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    storage.get(this.TOKEN_NAME).toPromise().then((token: any) => {
      oAuth2Client.setCredentials(token);
      this.listEvents(oAuth2Client);
    }).catch((err: any) => {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.SCOPES,
      });
      this.http.get(authUrl).subscribe((code: string) => {
        oAuth2Client.getToken(code, (err, token) => {
          if (!err) {
            oAuth2Client.setCredentials(token);
            this.storage.set(this.TOKEN_NAME, token);
            this.listEvents(oAuth2Client);
          }
        })
      })
    })
  }

  listEvents(auth: any): void {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err:any, res:any) => {
      if (err) {
        console.log(err);
      } else {
        this.dates = new Array<CalendarEvent>();
        res.data.items.map((e: any, i: number, a: Array<any>) => {
          const newEvent: CalendarEvent = null;
          for (const key in e) {
            if (e.hasOwnProperty(key)) {
              newEvent[key] = e[key];
            }
          }
          this.dates.push(newEvent);
        });
      }
    });
  }

}
