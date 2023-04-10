import { Word } from "../models/Word";

export class PalabraService {
    private _nombre: string = '';
    private _significado: string = '';

    get Nombre(): string {
        return this._nombre;
    }

    set Nombre(value: string) {
        this._nombre = value;
    }

    get Significado(): string {
        return this._significado;
    }

    set Significado(value: string) {
        this._significado = value;
    }

    constructor(nombre: string) {
        this.Nombre = nombre;
    }

    Coincide(significado: string, inversa: boolean): number {
        const id = inversa ? this.Nombre : this.Significado;
        const valor = significado.toLowerCase();

        const similarity1 = Word.similarity(id, valor);
        const similarity2 = this._Coincide(id, valor) / 100;

        return similarity1 > similarity2 ? similarity1 : similarity2;
    }

    private _Coincide(id: string, valor: string): number {

        if (id === this.eliminarAcento(valor)) {
            return 100;
        }

        const largoId = id.length;
        const largoValor = valor.length;

        if (largoId === 0 || largoValor === 0) {
            return 0;
        }

        if (largoId > largoValor) {
            return this.calcularPorcentaje(id, valor);
        } else {
            return this.calcularPorcentaje(valor, id);
        }
    }

    private eliminarAcento(palabra: string) {
        return palabra.trim()
            .toLowerCase()
            .replace("á", "a")
            .replace("é", "e")
            .replace("í", "i")
            .replace("ó", "o")
            .replace("ú", "u");
    }

    private calcularPorcentaje(id: string, valor: string): number {
        const porcentajeCentral = new PorcentajeCentral(id, valor).Calcular();
        const porcentajeIzq = new PorcentajeIzq(id, valor).Calcular();
        const porcentajeDer = new PorcentajeDer(id, valor).Calcular();

        if (porcentajeCentral > porcentajeIzq) {
            if (porcentajeCentral > porcentajeDer) {
                return porcentajeCentral;
            } else {
                return porcentajeDer;
            }
        } else {
            if (porcentajeIzq > porcentajeDer) {
                return porcentajeIzq;
            } else {
                return porcentajeDer;
            }
        }
    }
}

class PorcentajeCentral {
    protected _valor: string;
    private _id: string;

    constructor(id: string, valor: string) {
        this._valor = valor;
        this._id = id;
    }

    reducirValor(largoValor: number): void {
        if (largoValor % 2 === 0) {
            this._valor = this._valor.substring(0, largoValor - 1);
        } else {
            this._valor = this._valor.substring(1, largoValor);
        }
    }

    Calcular(): number {
        let largoValor = 0;

        do {
            largoValor = this._valor.length;

            if (this._id.indexOf(this._valor) >= 0) {
                return Math.round(largoValor / this._id.length * 100);
            } else {
                this.reducirValor(largoValor);
            }
        } while (largoValor > 0);

        return 0;
    }
}

class PorcentajeDer extends PorcentajeCentral {
    reducirValor(largoValor: number): void {
        this._valor = this._valor.substring(0, largoValor - 1);
    }
}

class PorcentajeIzq extends PorcentajeCentral {
    reducirValor(largoValor: number): void {
        this._valor = this._valor.substring(1, largoValor);
    }
}
