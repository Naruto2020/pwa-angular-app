import { Component, Input, OnInit } from '@angular/core';

export type ScanAlertType = 'error' | 'success' | 'info';

@Component({
  selector: 'app-scan-alert',
  templateUrl: './scan-alert.component.html',
  styleUrls: ['./scan-alert.component.scss']
})
export class ScanAlertComponent implements OnInit {
  @Input() type: ScanAlertType = 'info';
  @Input() title: string = '';
  @Input() introText?: string;
  @Input() reasons?: string[];
  @Input() ctaText?: string;
  @Input() actionButtonLabel?: string;
  @Input() actionLink?: string;

  showScanAlert = true;

  constructor() { }

  ngOnInit(): void { }

  hideModal() {
    this.showScanAlert = false;
  }
}
