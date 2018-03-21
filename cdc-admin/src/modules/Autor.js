import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import CustomInput from '../components/customInput';
import CustomButton from '../components/customButton';
import TrataErros from '../modules/TrataErros';

class FormAutor extends Component {
    constructor() {
        super();
        this.state = {
            nome: '',
            email: '',
            senha: ''
        };
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    enviaForm(event) {
        event.preventDefault();
        
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({
                nome: this.state.nome,
                email: this.state.email,
                senha: this.state.senha
            }),
            success: function(res) {
                PubSub.publish('atualizar-lista-autores', res);
                this.setState({
                    nome: '',
                    email: '',
                    senha: ''
                });
            }.bind(this),
            error: function(err) {
                if(err.status === 400) {
                    new TrataErros().publicaErros(err.responseJSON);
                }
            },
            beforeSend: function() {
                PubSub.publish('limpa-erros', {});
            }
        });
    }

    setNome(event) {
        this.setState({nome: event.target.value});
    }

    setEmail(event) {
        this.setState({email: event.target.value});
    }

    setSenha(event) {
        this.setState({senha: event.target.value});
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <CustomInput label="Nome" id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} />
                    <CustomInput label="Email" id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} />
                    <CustomInput label="Senha" id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} />
                    <CustomButton label="Gravar" />
                </form>             
            </div>
        );
    } 
}

class TableAutor extends Component {
    render() {
        return (
            <table className="pure-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>email</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.lista.map(function(autor) {
                            return (
                                <tr key={autor.id}>
                                    <td>{autor.nome}</td>                
                                    <td>{autor.email}</td>                
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table> 
        );
    } 
}

export class AutorBox extends Component {
    constructor() {
        super();
        this.state = {
            lista: []
        };
    }

    componentDidMount() {
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            dataType: 'json',
            success: function(res) {
                this.setState({lista: res});
            }.bind(this)
        });

        PubSub.subscribe('atualizar-lista-autores', function(topic, newList) {
            this.setState({lista: newList});
        }.bind(this));
    }

    render() {
        return (
            <div className="content" id="content">
                <h2 className="content-subhead">Cadastrar Autores</h2>
                <FormAutor />
                <TableAutor lista={this.state.lista} />
            </div>
        );
    }
}

export default AutorBox;