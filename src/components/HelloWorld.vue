<template>
  <app>
    <v-container>

      <v-row justify="space-around">
        <v-col :cols="columnSizes">
          <!-- Estilos Vuetify aplicados en el componente -->
          <v-card class="my-6" elevation="0">
            <v-card-title class="display-2 font-weight-bold primary--text text-center">
              ¡Gran Batalla en Null Valley!
            </v-card-title>

            <v-card-subtitle class="subtitle-1 grey--text text-center">
              ¡La rivalidad entre David Larousse y Jonathan Lowrie ha llegado a su punto máximo!
            </v-card-subtitle>

            <v-card-text class="body-1 text-center">
              ¿Estás listo para elegir al campeón? ¡Vota por <span style="font-weight: bold">#TeamLarousse</span> o <span
                style="font-weight: bold">#TeamLowrie</span> y
              decide el destino del próximo
              campeonato de Karate!
            </v-card-text>
            {{ buscarGanadorEmpate }}

            <v-card elevation="0" v-if="this.votes.length > 0">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dense color="primary" @click="resetDatabases" :loading="loadReset">Reiniciar la encuesta</v-btn>
              </v-card-actions>
            </v-card>

          </v-card>
        </v-col>
      </v-row>

      <v-row :key="primaryKey">
        <v-col v-for="(item) of this.names " :key="item._id" :cols="columnSizes">
          <v-card :class="{ 'win-card': win, 'tie-card': tie }" width="500px" class="mx-auto">
            <v-card-title>
              <span style="color:orange">{{ win ? '¡Ganador!' : tie ? '¡Empate!' : '¡Vota Por!' }}</span>
              <span class="mx-2">{{
                item.nombre
              }}</span>
            </v-card-title>
            <v-card-subtitle>
              <div class="d-flex">Puntuación: {{ calculoPuntaje(item._id) }}</div>
            </v-card-subtitle>
            <v-card-text>

              <img class="mx-3 my-3"
                :src="item.nombre == 'David Larousse' ? 'https://mail.google.com/mail/u/0?ui=2&ik=4d761c0211&attid=0.3&permmsgid=msg-f:1788187660438129899&th=18d0eb33f426cceb&view=fimg&fur=ip&sz=s0-l75-ft&attbid=ANGjdJ_P5xLoWnDluO83td60QwQ3fFdZ6vUP7aNk6B4r6VvhxNlqS8KGTJGwJuj-3fqaui-mA7Tia8Gc00rHYnon98yrTWj4fzy0m2fdHvGEj1yiHOarwJpIxe1I-GE&disp=emb' : 'https://mail.google.com/mail/u/0?ui=2&ik=4d761c0211&attid=0.2&permmsgid=msg-f:1788187660438129899&th=18d0eb33f426cceb&view=fimg&fur=ip&sz=s0-l75-ft&attbid=ANGjdJ_NMgZ5hRfg5bWfF8gLiATYfSg-Gv5TG-Mkvc49gEoAwTFfSAQ54JasZff2xjw_ORCQZiFBlr6swdEq4IdcaOtygxEfaUuFy-5WLewGatTrqRdFTPOsRkwICrg&disp=emb'"
                height="400px" width="300px">

              <div class="mx-3 my-3">
                <div>{{ item.desc }}</div>
                <div><v-divider class="my-2"></v-divider></div>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-row>

                <v-col cols="6">

                  <v-tooltip bottom color="error">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn outlined block v-bind="attrs" v-on="on" @click="abrirDialogo(item._id)"
                        :disabled="maxVote">¡Vota Aquí!<v-icon>mdi-heart</v-icon></v-btn>
                    </template>
                    <span>Dejar tu apoyo a {{ item.nombre }} ❤</span>
                  </v-tooltip>

                </v-col>
                <v-col cols="3">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="green" v-bind="attrs" v-on="on">mdi-account-plus</v-icon>{{
                        calcularBuenos(item._id) }}
                    </template>
                    <span>Cantidad de Votantes a Favor.</span>
                  </v-tooltip>
                </v-col>

                <v-col cols="3">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="red" v-bind="attrs" v-on="on">mdi-account-remove</v-icon>{{
                        calcularMalos(item._id) }}
                    </template>
                    <span>Cantidad de Votantes en Contra.</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>

          <!-- Aqui Caja Comentarios -->
          <v-card width="500px" class="mx-auto" v-if="votes.filter(itm => itm.champions == item._id).length > 0">

            <v-divider></v-divider>
            <v-card-subtitle></v-card-subtitle>
            <v-card-text>

              <v-list-item two-line v-for="( item ) of votes.filter(itm => itm.champions == item._id).map(v => v) "
                :key="item._id">
                <v-list-item-avatar>
                  <v-img v-if="item.comentario.includes('****')" src="https://www.blexar.com/avatar.png"></v-img>
                  <v-img v-else
                    src="https://previews.123rf.com/images/moremar/moremar1907/moremar190700033/132121691-el-rostro-de-una-ni%C3%B1a-feliz-avatar-de-una-joven-riendo-retrato-ilustraci%C3%B3n-vectorial-plana.jpg"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title style="font-size:14px;color:grey"><span>Nick:</span> <span
                      v-if="item.comentario.includes('****')"><b>{{ item.nombre }}
                        (Ofuscar)</b></span> <span v-else>{{ item.nombre }}</span>
                    <br>
                    <span style="font-size:14px;color:grey">Fecha:
                      {{
                        formatFecha(item.fechaCreacion)
                      }}</span></v-list-item-title>
                  <v-list-item-subtitle><span style="font-size:14px;color:grey">Comentario: {{ item.comentario
                  }}</span></v-list-item-subtitle>
                  <v-list-item-subtitle>Valoración: <span v-if="item.value == 2" style="color:green;font-size:14px">A
                      Favor ({{ item.value }})</span>
                    <span v-else-if="item.value == -1" style="color:red;font-size:14px">En Contra ({{ item.value
                    }})</span></v-list-item-subtitle>
                </v-list-item-content>

              </v-list-item>

            </v-card-text>
            <v-card-actions></v-card-actions>
          </v-card>
          <!-- Aqui Caja Comentarios -->

        </v-col>
      </v-row>
      <br>
      <v-footer padless>
        <v-col class="text-center" cols="12">
          {{ new Date().getFullYear() }} — <strong>Mauricio Alarcón Keilendt</strong>
        </v-col>
      </v-footer>

      <v-overlay :value="overlay">
        <div class="text-center">
          <v-progress-circular indeterminate size="64"></v-progress-circular>

          <div style="font-size: 40px; margin: 5px">Reiniciando la base de datos.</div>
        </div>
      </v-overlay>



      <v-dialog v-model="dialogVote" width="600px">
        <v-card>
          <v-card-title>¡Ingrese su Voto Aquí! Tu Voto es importante</v-card-title>
          <v-card-text>
            <v-text-field outlined dense v-model="votante.nombre" label="Ingrese su nickname" :rules="nombreValidation"
              counter></v-text-field>
            <v-textarea outlined dense v-model="votante.comentario" label="Comentarios" :rules="comentarioValidation"
              counter></v-textarea>
          </v-card-text>

          <v-card-actions class="d-flex justify-center">
            <v-btn dense class="success ma-2" @click="generarVoto(votante, 'voteOk', 'vote')" :loading="loadVoto"
              :disabled="!nombreValido || !comentarioValido">A Favor</v-btn>
            <v-btn dense color="error" @click="generarVoto(votante, 'voteNo', 'vote')" :loading="loadVoto"
              :disabled="!nombreValido || !comentarioValido">En Contra</v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>


    </v-container>

  </app>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
/* const moment = require('moment') */

export default {

  props: {
    msg: String
  },
  data() {

    return {
      // Puedes definir variables de datos aquí
      loading: false,
      names: [],
      dialogVote: false,
      votante: {},
      championSelected: '',
      loadVoto: false,
      votes: [],
      mnsjValidate: '',
      overlay: false,
      mensajeOverlay: '',
      loadReset: false,
      badWords: [],
      verComentarios: false,
      votesComment: [],
      nombreComment: '',
      win: false,
      tie: false,
      valorMaxVote: 2,
      primaryKey: crypto.randomUUID()
    }
  },
  mounted() {
    // Cuerpo de los metodos que se ejecutan antes de que se renderice la vista
    this.fetchData('users')
    this.fetchData('vote') || []
    this.fetchData('badWords') || []
  },
  methods: {


    censurarPalabrasProhibidas(comment) {
      const badWords = this.badWords
      let comentarioCensurado = comment

      badWords.forEach(palabra => {
        const regex = new RegExp(`\\b${palabra.nombre}\\b`, 'gi') // Busca la palabra completa
        comentarioCensurado = comentarioCensurado.replace(regex, '****')
      })

      return comentarioCensurado
    },

    formatFecha(date) {
      return moment(date).format('DD-MM-YYYY HH:mm:ss a')
    },


    async comment(item) {

      this.verComentarios = true
      this.nombreComment = item.nombre
      this.votesComment = this.votes.filter(vote => vote.champions == item._id)

    },

    async RegenerarFetch() {
      this.fetchData('vote') || []
      /* this.fetchData('users') */
    },
    // Métodos que realizan acciones
    async generarVoto(votante, voteType, collectionName) {

      this.loadVoto = true

      if (voteType == 'voteNo') {
        votante.vote = 'No'
        votante.value = parseInt(-1)
      } else if (voteType == 'voteOk') {
        votante.vote = 'Ok'
        votante.value = 2
      }

      if (votante.comentario)

        try {
          const response = await fetch(`http://localhost:3000/api/data/${collectionName}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...votante, _id: crypto.randomUUID(), fechaCreacion: new Date() || moment().toDate() }),
          })
          const data = await response.json()
          console.log('Voto generado:', data)
          this.loadVoto = false
          this.dialogVote = false
          this.RegenerarFetch()
          this.refresh()

        } catch (e) {
          console.log(e.message)
          this.refresh()
          this.loadVoto = false
        }

    },

    calcularBuenos(_id) {
      const ar = this.votes.filter((val) => val.champions == _id && val.vote == 'Ok').length || 0
      return ar
    },

    calcularMalos(_id) {
      const ar = this.votes.filter((val) => val.champions == _id && val.vote == 'No').length || 0
      return ar
    },

    calculoPuntaje(_id) {
      const ar = _.sumBy(this.votes.filter((val) => val.champions == _id), 'value') || 0
      return ar
    },

    abrirDialogo(_id) {
      this.dialogVote = true
      this.votante = {
        champions: _id
      }
    },

    async resetDatabases() {

      this.overlay = true
      this.loadReset = true
      try {
        const response = await fetch('http://localhost:3000/api/reset-databases', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        console.log('Respuesta del servidor:', data)

        this.loadReset = false
        location.reload();

        this.RegenerarFetch()


      } catch (error) {
        console.error('Error al reiniciar las bases de datos:', error)

      }
    },

    async fetchData(collectionName) {
      try {
        this.loading = true
        const response = await fetch(`http://localhost:3000/api/data/${collectionName}`)
        const data = await response.json()


        console.log('Datos obtenidos:', data)

        if (collectionName === 'users') {
          this.names = data
        } else if (collectionName === 'vote') {
          this.votes = data
        } else if (collectionName === 'badWords') {
          this.badWords = data
        }

      } catch (error) {
        console.error('Error al obtener datos desde el servidor:', error)
      } finally {
        this.loading = false
      }
    },

    namesAr(ganador, condicion) {
      if (ganador && condicion == 'Ganador') {
        // Mostrar solo al ganador
        this.names = this.names.filter(item => item._id === ganador._id);
        this.win = true;
      } else if (condicion == 'Empate') {
        // Mostrar a todos en caso de empate
        this.tie = true;
      } else {
        this.tie = false
        this.win = false
      }
    },

    keyCard() {
      this.primaryKey = crypto.randomUUID()
    },

  },
  computed: {



    buscarGanadorEmpate() {
      let votos = this.votes.length;
      const nuevoArr = [];

      if (votos === this.valorMaxVote) {
        for (let usuario of this.names) {
          let sum = 0;
          for (let voto of this.votes) {
            if (usuario._id === voto.champions) {
              sum += parseInt(voto.value);
            }
          }

          const val = {
            _id: usuario._id,
            value: sum
          };

          nuevoArr.push(val);
        }

        // Determinar el ganador o empate
        const sonTodosIguales = nuevoArr.every((usuario, index, array) => usuario.value === array[0].value);

        if (sonTodosIguales) {
          // En caso de empate
          this.namesAr(null, 'Empate');
          return '';
        } else {
          // En caso de ganador
          const ganador = nuevoArr.reduce((max, usuario) => (usuario.value > max.value ? usuario : max), nuevoArr[0]);
          this.namesAr(ganador, 'Ganador');
          return '';
        }
      } else {
        // En caso de que no haya suficientes votos
        this.namesAr(null, 'vota');
        return 'No hay suficientes votos para determinar un ganador';
      }
    },

    maxVote() {
      return this.votes.length == this.valorMaxVote ? true : false
    },

    nombreValido() {
      return this.nombreValidation.every(rule => rule(this.votante.nombre) === true)
    },

    comentarioValido() {
      return this.comentarioValidation.every(rule => rule(this.votante.comentario) === true)
    },

    nombreValidation() {
      return [
        v => !!v || 'El nombre es requerido',
        v => (v && /^[a-zA-Z0-9]{6,8}$/.test(v)) || 'Ingrese entre 6 y 8 caracteres alfanuméricos',
      ]
    },

    comentarioValidation() {
      return [
        v => !!v || 'El comentario es requerido',
        v => (v.length <= 120) || 'El comentario no puede exceder los 120 caracteres',
      ]
    },

    validate() {

      if (this.votante.nombre == '' || this.votante.comentario == '') {
        return true
      } else {
        return false
      }

    },
    // Propiedades calculadas basadas en el estado de los datos
    columnSizes() {
      return {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3
      }
    }
  },
  watch: {
    // Observadores que reaccionan a cambios en las variables de datos
    'votante.comentario': function (newComment) {
      this.votante.comentario = this.censurarPalabrasProhibidas(newComment)
    },

    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 3000)
    },


  }
}
</script>


<style scoped>
.cog-icon {
  transform: scale(1.7);
  /* Escala el ícono según se necesite */
  font-size: 128px;
}

.rotate-cog {
  animation: rotate-cog 2s linear infinite;
}

@keyframes rotate-cog {
  0% {
    transform: rotate(0deg) scale(1.7);
    /* Inicia la animación con el ícono escalado */
  }

  100% {
    transform: rotate(360deg) scale(1.7);
    /* Termina la animación con el ícono escalado */
  }
}

.win-card {
  /* background-color: #ffd700; */
  /* Color de fondo dorado */
  border: 2px solid #ffd700;
  /* Borde dorado */
}

.headline {
  margin: 40px 0 0
}

/* Estilos personalizados para el componente */

.primary--text {
  color: #1976D2;
  justify-content: center;
  line-height: 2.2;
}

.body-1 {
  line-height: 1.8
    /* Altura de línea para un mejor espaciado del texto */
}

.my-6 {
  margin-top: 6rem;
  margin-bottom: 6rem;
}

.primary--text {
  color: #FF5722
    /* Color naranja intenso para destacar */
}

.subtitle-1 {
  font-size: 1.5rem
    /* Tamaño de fuente para subtítulos */
}

.grey--text {
  color: grey
    /* Color de texto gris */
}
</style>
