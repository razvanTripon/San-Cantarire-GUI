import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgGridNg2 } from 'ag-grid-angular';
import { RowNode } from 'ag-grid-community';
import { UsersService } from './users.service';
import { EditUserService } from './edit-user/edit-user.service';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss'],
  providers: [EditUserService]
})
export class UsersManagementComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  @ViewChild('agGrid', { static: true }) agGrid: AgGridNg2;
  rowData;
  columnDefs = [
    { headerName: 'CODU', field: 'CODU', hide: true },
    { headerName: 'UTILIZATOR', field: 'EMAIL', sortable: true, filter: true },
    { headerName: 'NUME PRENUME', field: 'NUME_PRENUME', sortable: true, filter: true },
    { headerName: 'CNP', field: 'CNP', sortable: true, filter: true },
    { headerName: 'NIVEL ACCES', field: 'FACCES', sortable: true, filter: true },
    { headerName: 'TELEFON', field: 'TEL', sortable: true, filter: true }

  ];
  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.subscription.add(
      this.usersService.loadGridUsers$.subscribe(data => {
        this.rowData = this.usersService.getDateServerUsers();
      })
    )
  }


  onRowDataChanged() {
    this.agGrid.api.forEachNode((rowNode: RowNode, index: number) => {
      if (index == 0) {
        rowNode.setSelected(true);
        this.usersService.rowSelectedUsers$.next(rowNode.data["CODU"])
      }
    })
  }

  onFilterChanged() {
    this.usersService.rowSelectedUsers$.next(null);
    this.agGrid.api.forEachNodeAfterFilter((rowNode: RowNode, index: number) => {
      if (index == 0) {
        rowNode.setSelected(true);
        this.usersService.rowSelectedUsers$.next(rowNode.data["CODU"])
      }
    })
  }

  onSelectionChanged() {
    this.agGrid.api.getSelectedNodes().forEach((rowNode: RowNode) => {
      this.usersService.rowSelectedUsers$.next(rowNode.data["CODU"])
    })
  }

  onGridReady() {
    this.usersService.loadGridUsers$.next(true);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
