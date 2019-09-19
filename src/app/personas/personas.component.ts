import { Component, OnInit, ViewChild } from '@angular/core';
import { Persona, Departamento, Ciudad } from 'app/models/persona';
import { MatTableDataSource, MatPaginator, MatSort, MatAutocompleteSelectedEvent } from '@angular/material';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { PersonaService, LocalizacionService } from 'app/services/persona.service';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})
export class PersonasComponent implements OnInit {

  baseHREF:string = environment.baseHREF;
  public personas: Persona[];
  public persona: Persona;
  public cargando: boolean;
  public registrando: boolean;
  public fechaNacimientoPersona:NgbDateStruct;

  public ciudadesSearch: Ciudad[] = [];

  //View 
  displayedColumns: string[] = ['Indice','Nombre', 'Apellido', 'EstadoCivil', 'FechaNacimiento', 'Sueldo','Correo', 'Departamento','Ciudad'];
  dataSource : MatTableDataSource<Persona> = new MatTableDataSource();
  paginator: MatPaginator; // Paginar
  
  @ViewChild(MatPaginator, {static:false}) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatSort, {static:false}) sort: MatSort; //Ordenar

  //Filtrado
   applyFilter = (filterValue: string) => {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private toastr: ToastrService,
              private modal: NgbModal,
              private personaService: PersonaService,
              private localizacionService: LocalizacionService) { }

  ngOnInit() {
    this.persona = new Persona();
    this.listarDepartamentos();
    this.listarCiudadesSearch();
    this.listar();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data, filter) => {
      let filterLower = filter.toLowerCase().trim();
      return data.nombre.toLowerCase().indexOf(filterLower) != -1
            || data.apellido.toLowerCase().indexOf(filterLower) != -1;
    };
  }

  listar(){
    this.cargando = true;
    this.personaService.listar().subscribe(lista => this.personas = lista,
      null,
      () => {
        this.cargando = false
        this.dataSource = new MatTableDataSource<Persona>(this.personas); //Asignar source
        this.dataSource.sort = this.sort;
      });
  }

  registrar(){
    this.registrando = true;
    
    this.persona.fechaNacimiento = new Date(this.fechaNacimientoPersona.year, this.fechaNacimientoPersona.month-1, this.fechaNacimientoPersona.day);
    this.persona.ciudad = this.controlCiudades.value.id;
    if(this.puedeRegistrar()){
      this.personaService.registrar(this.persona).subscribe(respuesta => {
        if(respuesta.nombre)
          this.toastr.success("Registrado correctamente");
        else
          this.toastr.error("Error al registrar. Intentelo nuevamente");
      }, e => this.toastr.error(e)
      , () => {
        this.registrando = false;
        this.listar();
      });
    }

  }

  modalRegistrar(content){
    this.modal.open(content, { backdrop:'static', size: 'lg' });
  }

  puedeRegistrar(){
    if(this.persona.ciudad == null && this.persona.departamento == null)
    {
      this.toastr.error("Debe escoger el departamento y la ciudad");
      return false;      
    }
    return true;
  }

  public departamentos: Departamento[] = [];

  listarDepartamentos(){
    this.localizacionService.departamentos().subscribe(lista => this.departamentos = lista, null, () =>{
        this.departamentosFiltrados = this.controlDepartamentos.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.nombre),
          map(name => name ? this._filterDepartamentos(name) : this.departamentos.slice())
        );
    });
  }

  departamentosFiltrados: Observable<Departamento[]>;
  controlDepartamentos = new FormControl();

  displayFnDepartamentos(departamento?: Departamento): string | undefined {
    return departamento ? departamento.nombre : undefined;
  }

  private _filterDepartamentos(name: string): Departamento[] {
    const filterValue = name.toUpperCase();

    return this.departamentos.filter(option => option.nombre.toUpperCase().includes(filterValue.toUpperCase()));
  }

  dptoSeleccionado(evento: MatAutocompleteSelectedEvent){
    if(evento != null){
      this.listarCiudades(evento.option.value.id);
      this.persona.departamento = evento.option.value.id; 
    }
  }

  public ciudades: Ciudad[];

  listarCiudades(idDepartamento:number){
    this.localizacionService.ciudades(idDepartamento).subscribe(lista => this.ciudades = lista, null, () =>{
        this.ciudadesFiltradas = this.controlCiudades.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.nombre),
          map(name => name ? this._filterCiudades(name) : this.ciudades.slice())
        );
    });
  }

  ciudadesFiltradas: Observable<Ciudad[]>;
  controlCiudades = new FormControl();

  displayFnCiudades(ciudad?: Ciudad): string | undefined {
    return ciudad ? ciudad.nombre : undefined;
  }

  private _filterCiudades(name: string): Ciudad[] {
    const filterValue = name.toUpperCase();

    return this.ciudades.filter(option => option.nombre.toUpperCase().includes(filterValue.toUpperCase()));
  }


  listarCiudadesSearch(){
    this.localizacionService.todasCiudades().subscribe(lista => this.ciudadesSearch = lista);
  }

  getCiudad(id:number){
    if(this.ciudadesSearch)
    return this.ciudadesSearch.find(x => x.id == id).nombre;
  }

  getDpto(id:number){
    if(this.departamentos)
    return this.departamentos.find(x => x.id == id).nombre;
  }

}
