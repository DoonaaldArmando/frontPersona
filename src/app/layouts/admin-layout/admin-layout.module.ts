import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PersonasComponent } from 'app/personas/personas.component';
import { NumberOnlyDirective } from 'app/helpers/number.directive';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatAutocompleteModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatRadioModule } from '@angular/material';
import localeCo from '@angular/common/locales/es-CO';

registerLocaleData(localeCo);

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatTableModule, 
    MatPaginatorModule,  
    MatSortModule, 
    MatAutocompleteModule, 
    MatSelectModule, 
    MatInputModule,
    MatFormFieldModule, 
    MatRadioModule
  ],
  declarations: [
    PersonasComponent,
    NumberOnlyDirective
  ],
  providers:[
    { provide: LOCALE_ID, useValue: "es-CO" }
  ]
})

export class AdminLayoutModule {}
