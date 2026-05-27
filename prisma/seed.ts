import { PrismaClient, Transmission, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@mahafaly.mg' },
    update: {},
    create: {
      email: 'admin@mahafaly.mg',
      name: 'Admin Mahafaly',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })
  console.log('✅ Admin account: admin@mahafaly.mg / admin123')

  await prisma.booking.deleteMany()
  await prisma.car.deleteMany()
  await prisma.vehicleCategory.deleteMany()

  const defaultTypes = ['SEDAN', 'SUV', 'COUPE', 'CONVERTIBLE', 'VAN', 'LUXURY']
  await prisma.vehicleCategory.createMany({ data: defaultTypes.map(name => ({ name })) })
  console.log(`✅ Created ${defaultTypes.length} vehicle categories`)

  const cars = [
    {
      name: 'Mercedes-Benz S-Class',
      brand: 'Mercedes-Benz',
      model: 'S 500',
      year: 2023,
      pricePerDay: 250,
      transmission: Transmission.AUTOMATIC,
      seats: 5,
      type: 'LUXURY',
      fuel: 'Essence',
      images: [
        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200',
      ],
      description: 'La Mercedes-Benz Classe S représente le summum du luxe automobile. Avec son intérieur opulent, sa technologie de pointe et ses performances exceptionnelles, cette berline redéfinit les standards de l\'excellence.',
      features: ['Toit panoramique', 'Sièges massants', 'Système audio Burmester', 'Conduite semi-autonome', 'Climatisation 4 zones'],
      available: true,
    },
    {
      name: 'BMW X7',
      brand: 'BMW',
      model: 'X7 xDrive40i',
      year: 2023,
      pricePerDay: 220,
      transmission: Transmission.AUTOMATIC,
      seats: 7,
      type: 'SUV',
      fuel: 'Essence',
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200',
      ],
      description: 'Le BMW X7 est le SUV premium par excellence. Spacieux, puissant et technologiquement avancé, il offre une expérience de conduite incomparable pour toute la famille.',
      features: ['3 rangées de sièges', 'iDrive 8', 'Suspension pneumatique', 'Phares laser', 'Hayon électrique'],
      available: true,
    },
    {
      name: 'Porsche 911',
      brand: 'Porsche',
      model: '911 Carrera S',
      year: 2023,
      pricePerDay: 350,
      transmission: Transmission.AUTOMATIC,
      seats: 4,
      type: 'COUPE',
      fuel: 'Essence',
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200',
        'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1200',
      ],
      description: 'Icône du sport automobile, la Porsche 911 offre des performances légendaires dans un package intemporel. Une expérience de conduite pure et émotionnelle.',
      features: ['450 chevaux', '0-100 km/h en 3.5s', 'PDK 8 rapports', 'Sport Chrono', 'PASM actif'],
      available: true,
    },
    {
      name: 'Tesla Model S',
      brand: 'Tesla',
      model: 'Model S Plaid',
      year: 2023,
      pricePerDay: 280,
      transmission: Transmission.AUTOMATIC,
      seats: 5,
      type: 'SEDAN',
      fuel: 'Électrique',
      images: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200',
        'https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=1200',
      ],
      description: 'La Tesla Model S Plaid est la berline électrique la plus rapide du monde. Technologie futuriste, autonomie exceptionnelle et performances hallucinantes définissent cette voiture révolutionnaire.',
      features: ['1020 chevaux', 'Autopilot avancé', 'Écran 17 pouces', '600 km autonomie', 'OTA updates'],
      available: true,
    },
    {
      name: 'Range Rover Vogue',
      brand: 'Land Rover',
      model: 'Range Rover Vogue SE',
      year: 2023,
      pricePerDay: 300,
      transmission: Transmission.AUTOMATIC,
      seats: 5,
      type: 'SUV',
      fuel: 'Diesel',
      images: [
        'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=1200',
        'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200',
      ],
      description: 'Le Range Rover Vogue est l\'incarnation du luxe britannique tout-terrain. Alliant raffinement extrême et capacités off-road légendaires, il vous emmène partout avec une élégance royale.',
      features: ['Suspension pneumatique', 'Pivi Pro', 'Toit panoramique', 'Massage 24 points', 'Terrain Response 2'],
      available: true,
    },
    {
      name: 'Audi A8',
      brand: 'Audi',
      model: 'A8 L 55 TFSI',
      year: 2023,
      pricePerDay: 240,
      transmission: Transmission.AUTOMATIC,
      seats: 5,
      type: 'LUXURY',
      fuel: 'Essence',
      images: [
        'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=1200',
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200',
      ],
      description: 'L\'Audi A8 L est la berline executive la plus technologique du marché. Son intérieur ultra-moderne avec Virtual Cockpit et son confort de limousine en font le choix idéal pour les voyages d\'affaires.',
      features: ['Virtual Cockpit Plus', 'Suspension active', 'Night Vision', 'Massage 5 zones', 'B&O 3D Sound'],
      available: true,
    },
  ]

  for (const car of cars) {
    await prisma.car.create({ data: car })
  }

  console.log(`✅ Created ${cars.length} cars`)
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
