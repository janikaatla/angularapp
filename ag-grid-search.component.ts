import {Component, Input, OnInit, Output} from '@angular/core';
import {ClientInfo} from '../model/ClientInfo';
import {AppService} from '../service/app.service';
import {Parameters} from '../model/Parameters';
import {DataWithCount} from '../model/DataWithCount';

@Component({
  selector: 'app-ag-grid-search',
  templateUrl: './ag-grid-search.component.html',
  styleUrls: ['./ag-grid-search.component.scss']
})
export class AgGridSearchComponent implements OnInit {
  public parameterModel: Parameters;
  clientinfoList: ClientInfo[] = [];
  dataWithCount: DataWithCount;
  show = false;

  /* Custome Pagination */
  // @Output() changePage = new EventEmitter<any>(true);
  @Input() initialPage = 1;
  @Input() pageSize = 10;
  @Input() maxPages = 10;
  pager: Paginate;
  startIndex: number;
  endIndex: number;
  pageNo: number;
  totalElements: number;
  length: number;

  /*AG-Grid */
  private gridApi;
  private gridColumnApi;


  /*public modules: Module[] = [
    ServerSideRowModelModule,
    RowGroupingModule,
    MenuModule,
    ColumnsToolPanelModule,
  ];*/
  sortingOrder;
  columnDefs;
  private defaultColDef;
  private paginationPageSize;
  private cacheOverflowSize;
  private maxConcurrentDatasourceRequests;
  private infiniteInitialRowCount;
  private maxBlocksInCache;
  private rowModelType;
  rowData: any = [];


  constructor(private appService: AppService) {
    this.pageNo = 1;
    this.pageSize = 10;
    this.startIndex = 0;
    this.endIndex = this.pageSize;
    this.columnDefs = [
      {
        field: 'name',
        minWidth: 520,
        resizable: true,
        sortable: true
      },
      {
        field: 'email',
        minWidth: 90,
        resizable: true
      },
      {
        field: 'gender',
        maxWidth: 109,
        resizable: true
      },
      {
        field: 'mobile',
        maxWidth: 109,
        resizable: true
      }
    ];
    this.sortingOrder = ['desc', 'asc'];
  }

  ngOnInit(): void {
    // this.searchTheResult();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.appService.showLoader();
    this.parameterModel = new Parameters();
    this.parameterModel.pageNo = this.pageNo;
    this.parameterModel.pageSize = this.pageSize;
    this.parameterModel.startNo = this.startIndex;
    this.parameterModel.endNo = this.endIndex;
    console.log(this.parameterModel);
    this.dataWithCount = new DataWithCount();
    this.dataWithCount.totalCount = 254;
    this.appService.getServerData().subscribe((data: ClientInfo[]) => {
        // this.clientinfoList = data;
        console.log(data);
        this.dataWithCount.clientInfoList = data;
        if (this.dataWithCount) {
          this.gridApi.setRowData(this.dataWithCount.clientInfoList);
          this.length = this.dataWithCount.clientInfoList.length;
          this.totalElements = this.dataWithCount.totalCount;
          this.maxPages = Math.ceil(this.totalElements / this.pageSize);
          this.pager = this.paginate(this.totalElements, 1, this.pageSize, this.maxPages);
        }
        this.appService.hideLoader();
      },
      error => {
        this.appService.hideLoader();
      });
  }

  searchTheResult() {
    this.appService.showLoader();
    this.parameterModel = new Parameters();
    this.parameterModel.pageNo = this.pageNo;
    this.parameterModel.pageSize = this.pageSize;
    this.parameterModel.startNo = this.startIndex;
    this.parameterModel.endNo = this.endIndex;
    this.dataWithCount = new DataWithCount();
    this.dataWithCount.totalCount = 254;
    this.appService.getServerData().subscribe((data: ClientInfo[]) => {
        // this.clientinfoList = data;
        console.log(data);
        this.dataWithCount.clientInfoList = data;
        this.rowData = this.dataWithCount.clientInfoList;
        this.length = this.rowData.length;
        this.totalElements = this.dataWithCount.totalCount;
        this.maxPages = Math.ceil(this.totalElements / this.pageSize);
        this.pager = this.paginate(this.totalElements, 1, this.pageSize, this.maxPages);
        this.appService.hideLoader();
      },
      error => {
        this.appService.hideLoader();
      });
    // this.dataWithCount = this.appService.getAGSearchResult(this.parameterModel);
  }

  setPage(page: number) {
    this.appService.showLoader();
    this.pager = this.paginate(this.totalElements, page, this.pageSize, this.maxPages);
    this.parameterModel.pageNo = page;
    this.parameterModel.pageSize = this.pageSize;
    this.parameterModel.startNo = this.pager.startIndex;
    this.parameterModel.endNo = this.pageSize;
    /*this.rowData = this.appService.getAGSearchResultPagination(this.parameterModel);
    this.length = this.rowData.length;
    this.appService.hideLoader();*/
    this.appService.getServerData().subscribe((data: ClientInfo[]) => {
        // this.clientinfoList = data;
        console.log(data);
        this.dataWithCount.clientInfoList = data;
        this.rowData = this.dataWithCount.clientInfoList;
        this.length = this.rowData.length;
        this.totalElements = this.dataWithCount.totalCount;
        this.maxPages = Math.ceil(this.totalElements / this.pageSize);
        this.pager = this.paginate(this.totalElements, 1, this.pageSize, this.maxPages);
        this.appService.hideLoader();
      },
      error => {
        this.appService.hideLoader();
      });
    /*this.appService.getAGSearchResultPagination(this.parameterModel).subscribe((data: ClientInfo[]) => {
        this.show = true;
        // this.clientinfoList = data;
        this.rowData = data;
        this.length = this.rowData.length;
        this.appService.hideLoader();
      },
      error => {
        this.appService.hideLoader();
      });*/
  }
  sortChangeParm(params) {
    console.log('Parameters : getSortModel');
  }

  sortChange(params) {
    // this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;
    // this.appService.showLoader();
    console.log('Parameters : getSortModel');
    const sortState = this.gridApi.getSortModel();
    if (sortState.length === 0) {
      console.log('No sort active');
    } else {
      console.log('State of sorting is:');
      for (let i = 0; i < sortState.length; i++) {
        const item = sortState[i];
        this.parameterModel.sortingColumn = item.colId;
        this.parameterModel.sortingOrder = item.sort;
        console.log(i + ' = {colId: ' + item.colId + ', sort: ' + item.sort + '}');
      }
    }
    this.appService.getServerData().subscribe((data: ClientInfo[]) => {
        // this.clientinfoList = data;
        console.log(data);
        this.dataWithCount.clientInfoList = data;
        this.rowData = this.dataWithCount.clientInfoList;
        this.length = this.rowData.length;
        this.totalElements = this.dataWithCount.totalCount;
        this.maxPages = Math.ceil(this.totalElements / this.pageSize);
        this.pager = this.paginate(this.totalElements, 1, this.pageSize, this.maxPages);
        this.appService.hideLoader();
      },
      error => {
        this.appService.hideLoader();
      });
    /*this.clientinfoList = this.appService.getAGSearchResultPagination(this.parameterModel);
    this.gridApi.setRowData(this.clientinfoList);
    this.length = this.clientinfoList.length;
    this.appService.hideLoader();*/
    /*this.ctappService.getResultForPagination(this.parameterModel).subscribe((data: ClientInfo[]) => {
        this.show = true;
        this.rowData = data;
        this.length = this.rowData.length;
        this.ctappService.hideLoader();
      },
      error => {
        this.ctappService.hideLoader();
      });*/
  }

  paginate(totalItems, currentPage, pageSize, maxPages) {
    if (currentPage === void 0) { currentPage = 1; }
    if (pageSize === void 0) { pageSize = 10; }
    if (maxPages === void 0) { maxPages = 10; }
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);
    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    let startPage;
    let endPage;
    if (totalPages <= maxPages) {
      // total pages less than max so show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // total pages more than max so calculate start and end pages
      const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        // current page near the start
        startPage = 1;
        endPage = maxPages;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // current page near the end
        startPage = totalPages - maxPages + 1;
        endPage = totalPages;
      } else {
        // current page somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }
    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    // create an array of pages to ng-repeat in the pager control
    const pages = [currentPage]; // Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
    // return object with all pager properties required by the view
    const pagenate = new Paginate();
    pagenate.totalItems = totalItems;
    pagenate.currentPage = currentPage;
    pagenate.pageSize = pageSize;
    pagenate.totalPages = totalPages;
    pagenate.startPage = startPage;
    pagenate.endPage = endPage;
    pagenate.startIndex = startIndex;
    pagenate.endIndex = endIndex;
    pagenate.pages = pages;
    return pagenate;
  }

}


export class Paginate {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  startIndex: number;
  endIndex: number;
  pages: number[];
}
