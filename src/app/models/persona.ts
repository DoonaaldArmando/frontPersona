export class Persona{
    id:number;
    nombre: string;
    apellido: string;
    estadoCivil: number;
    fechaNacimiento: Date;
    sueldo:number;
    correo: string;
    departamento: number;
    ciudad: number;
}

export class Departamento{
    id: number;
    nombre: string;
}

export class Ciudad{
    id: number;
    nombre: string;
    idDepartamento: number;
}