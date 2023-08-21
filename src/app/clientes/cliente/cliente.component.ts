import { Cliente } from './../../cliente/models/cliente';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from 'src/app/cliente/services/cliente.service';
import { ClienteViewModel } from 'src/app/cliente/models/cliente-view-model';
import { ClienteFormComponent } from '../cliente-form/cliente-form.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private clienteService: ClienteService
    ) { }

    clientes: ClienteViewModel[] = [];
    modoInsercao: boolean = true;
    cliente: ClienteViewModel;

  ngOnInit() {
    this.mostrarClientes();
  }

  carregarTudo() {

  }


  addCliente() {
    const modal = this.modalService.open(ClienteFormComponent)
    modal.result.then(
      this.handleModalClientForm.bind(this),
      this.handleModalClientForm.bind(this))
  }

  editarClick(cliente: ClienteViewModel){
    const modal = this.modalService.open(ClienteFormComponent);
    modal.result.then(
      this.handleModalClientForm.bind(this),
      this.handleModalClientForm.bind(this)
  )
  modal.componentInstance.modoInsercao = false;
  modal.componentInstance.cliente = cliente;
  }

  mostrarClientes(){
    this.clienteService.getClientes().subscribe(response => {
      this.clientes = [];
      response.docs.forEach(value => {
        const data = value.data();
        const id = value.id;
        const cliente: ClienteViewModel = {
          id: id,
          nome: data.nome,
          endereco: data.endereco,
          casado: data.casado,
          dataMod: data.dataMod
        };
        this.clientes.push(cliente);
      });
    });
  }

  checkedCasado(index: number){
    const novoValor = !this.clientes[index].casado //novo valor n checado
    this.clientes[index].casado = novoValor; // quando passar o valor ele verifica e passa novo valor
    const obj = {casado: novoValor};
    const id = this.clientes[index].id
    this.clienteService.editarClienteParcial(id, obj);
  }

  deletarClick(clienteId: string, index: number){
    this.clienteService.deletarClientes(clienteId)
    .then(() => { this.clientes.splice(index, 1); })
    .catch(err => console.error(err));
  }

  handleModalClientForm(response){
    if(response === Object(response)){
      if(response.modoInsercao){
        response.cliente.id = response.id;
        this.clientes.unshift(response.cliente);
      }
      else {
        let index = this.clientes.findIndex(value => value.id == response.id);
        this.clientes[index] = response.cliente;
      }
    }
  }


}
