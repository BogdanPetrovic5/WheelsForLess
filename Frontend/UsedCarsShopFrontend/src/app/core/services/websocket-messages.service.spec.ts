import { TestBed } from '@angular/core/testing';

import { WebsocketMessagesService } from './websocket-messages.service';

describe('WebsocketMessagesService', () => {
  let service: WebsocketMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
