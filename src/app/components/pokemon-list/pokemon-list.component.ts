import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { forkJoin } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  pokemons: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'actions'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    await this.getPokemonData();
  }

  async getPokemonData() {
    try {
      const requests = Array.from({ length: 151 }, (_, i) => i + 1).map(i =>
        this.http.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
      );
  
      const data = await firstValueFrom(forkJoin(requests));
      this.pokemons = new MatTableDataSource(data);
      this.pokemons.paginator = this.paginator;
      this.pokemons.sort = this.sort;
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.pokemons.filter = filterValue.trim().toLowerCase();
  }

  deletePokemon(pokemon: any) {
    const index = this.pokemons.data.findIndex(p => p === pokemon);
    if (index > -1) {
      this.pokemons.data.splice(index, 1);
      this.pokemons._updateChangeSubscription();
    }
  }
}