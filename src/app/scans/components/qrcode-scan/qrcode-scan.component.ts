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
          console.log('QR Code détecté:', url);

          const allowedPrefix = 'http://localhost:4200/teik/products/current-product';


          if (this.isValidUrl(url) && url.startsWith(allowedPrefix)) {
            window.location.href = url; // Redirect user trhough detected url
          } else {
            alert('⚠️ QR Code détecté mais l\'URL n\'est pas autorisée ou peut être une contrefaçon ! 💀...');

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
