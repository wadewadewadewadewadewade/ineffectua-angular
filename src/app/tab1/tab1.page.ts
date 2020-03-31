import { Component } from '@angular/core';
// import { StorageMap } from '@ngx-pwa/local-storage';
// import { HttpClient } from '@angular/common/http';

// Calendar API credentials
import { GoogleApiService } from 'ng-gapi';

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
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  dates: Array<CalendarEvent>;

  constructor(private gapiService: GoogleApiService) {}

  listEvents(auth: any): void {
    this.gapiService.onLoad().subscribe((gapi: any) => {
      gapi.client.load('calendar', 'v3');
      gapi.client.calendar.events.list({
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
    });
  }

}
