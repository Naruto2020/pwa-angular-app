import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';

@Component({
  selector: 'app-qrcode-scan',
  templateUrl: './qrcode-scan.component.html',
  styleUrls: ['./qrcode-scan.component.scss']
})
export class QrcodeScanComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  codeReader = new BrowserMultiFormatReader();
  scanning = false;
  isFakeUrl = false;
  multiScanMode = false;
  scanUrls : string[] = [];

  constructor() { }


  ngAfterViewInit() {
    this.startScan();
  }

  startScan() {
    this.scanning = true;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
      this.videoElement.nativeElement.srcObject = stream;
      this.videoElement.nativeElement.play();

      this.codeReader.decodeFromVideoElement(this.videoElement.nativeElement, (result, err) => {
        if (result) {
          const url = result.getText();

          const allowedPrefix = 'http://localhost:4200/teik/products/current-product'; // To protect against phishing

          if (this.isValidUrl(url) && url.startsWith(allowedPrefix)) {
            if(this.multiScanMode) {
              console.log('multi scan mode détecté:');

              //if(!this.scanUrls.includes(url)) {
                this.scanUrls.push(url);
                console.log('Ajouté à la liste :', this.scanUrls);
              //}
            }else {

              console.log('QR Code détecté:', url);
              this.stopScan(); // Stop scanning after first valid URL
              window.location.href = url; // Redirect user trhough detected url
            }
          } else {
            this.isFakeUrl = true;

          }

        }
      });
    }).catch(err => {
      console.error('Erreur accès caméra :', err);
      alert('Impossible d\'accéder à la caméra');
    });
  }

  isValidUrl(url: string): boolean {
    const pattern = new RegExp('^(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*(\.[a-z]{2,5})?(:[0-9]{1,5})?(\/.*)?$', 'i');
    
    return pattern.test(url);
  }
  

  stopScan() {
    this.scanning = false;
    const stream = this.videoElement.nativeElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }
}
