import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ClientInfo} from '../model/ClientInfo';
import {environment} from '../../environments/environment';
import {DataWithCount} from '../model/DataWithCount';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  clientinfoList: ClientInfo[] = [];
  dataWithTotalCount: DataWithCount;

  // loadingRef: LoadingOverlayRef;
  // tslint:disable-next-line:variable-name
  private _url = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  getAGSearchResult(parameterModel) {
    /*const url = this._url + 'getCTSearchResult';
    return this.http.post<DataWithCount>(url, parameterModel);*/
    this.dataWithTotalCount = new DataWithCount();
    this.dataWithTotalCount.totalCount = 254;
    this.getServerData().subscribe((data: ClientInfo[]) => {
        // this.clientinfoList = data;
        console.log(data);
        this.dataWithTotalCount.clientInfoList = data;
      },
      error => {
        // this.appService.hideLoader();
      });
    // this.looptheData(parameterModel.startNo, parameterModel.endNo);
  }

  getAGSearchResultPagination(parameterModel) {
    /*const url = this._url + 'getCTSearchResult';
    return this.http.post<DataWithCount>(url, parameterModel);*/
    // this.looptheData(parameterModel.startNo, parameterModel.endNo);
    this.getServerData().subscribe((data: ClientInfo[]) => {
        console.log(data);
        this.clientinfoList = data;
    },
    error => {
      // this.appService.hideLoader();
      console.log('error');
    });
    return this.clientinfoList;
  }

  getServerData() {
    const url = this._url + 'AGGriddata';
    return this.http.get<ClientInfo[]>(url);
  }


  showLoader() {
    // this.isLoading = true;
    // this.loadingRef = this.spinnerOverlayService.open();
  }

  hideLoader() {
    // this.isLoading = false;
    /*if (this.loadingRef) {
      this.loadingRef.close();
    }*/
  }

  looptheData(startNo, endNo) {
    this.clientinfoList = [];
    let clientInfo = null;
    for (let i = startNo; i < endNo; i++) {
      clientInfo = new ClientInfo();
      clientInfo.name = 'Test' + i;
      clientInfo.gender = 'male';
      clientInfo.mobile = '900000900' + i;
      clientInfo.email = 'testmail' + i + '@company.com';
      this.clientinfoList.push(clientInfo);
    }
  }

  convertDateToString(str) {
    const date = new Date(str);
    const  mnth = ('0' + (date.getMonth() + 1)).slice(-2);
    const  day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }
}
