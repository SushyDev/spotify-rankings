/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        user: import('@models/user').default | null;
    }
}
