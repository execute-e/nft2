import styles from './index.module.scss'
import first from './images/1.svg'
import second from './images/2.svg'
import third from './images/3.svg'
import fourth from './images/4.svg'
import AnimatedContent from '@/styles/styleComponents/AnimatedContent/AnimatedContent'
import FadeContent from '@/styles/styleComponents/FadeContent/FadeContent'

const OurTeam: React.FC = () => {
	return (
		<section className={'container ' + styles.ourTeam} id='our-team'>
			<h2 className={styles.title}>Our Team</h2>
			<ul className={styles.teamMembers}>
				<li className={styles.member}>
					<a
						href='https://x.com/LitePlay2'
						target='_blank'
						rel='noreferrer'
						className={styles.link}
					>
						<FadeContent>
							<AnimatedContent
								distance={150}
								direction='vertical'
								reverse={false}
								duration={1.2}
								ease='bounce.out'
								initialOpacity={0.2}
								animateOpacity
								scale={1.1}
								threshold={0.2}
								delay={0.1}
							>
								<img className={styles.photo} src={first} />
								<div className={styles.memberInfo}>
									<h3 className={styles.name}>CABURUS</h3>
									<p className={styles.role}>Founder / Artist</p>
								</div>
							</AnimatedContent>
						</FadeContent>
					</a>
				</li>

				<li className={styles.member}>
					<a
						href='https://x.com/sekret_off'
						target='_blank'
						rel='noreferrer'
						className={styles.link}
					>
						<FadeContent>
							<AnimatedContent
								distance={150}
								direction='vertical'
								reverse={false}
								duration={1.2}
								ease='bounce.out'
								initialOpacity={0.2}
								animateOpacity
								scale={1.1}
								threshold={0.2}
								delay={0.3}
							>
								<img className={styles.photo} src={second} />
								<div className={styles.memberInfo}>
									<h3 className={styles.name}>Gabrielsosa</h3>
									<p className={styles.role}>Co - Founder / CM</p>
								</div>
							</AnimatedContent>
						</FadeContent>
					</a>
				</li>

				<li className={styles.member}>
					<a
						href='https://x.com/kasyak0'
						target='_blank'
						rel='noreferrer'
						className={styles.link}
					>
						<FadeContent>
							<AnimatedContent
								distance={150}
								direction='vertical'
								reverse={false}
								duration={1.2}
								ease='bounce.out'
								initialOpacity={0.2}
								animateOpacity
								scale={1.1}
								threshold={0.2}
								delay={0.5}
							>
								<img className={styles.photo} src={third} />
								<div className={styles.memberInfo}>
									<h3 className={styles.name}>KASYAK</h3>
									<p className={styles.role}>Team / Mod</p>
								</div>
							</AnimatedContent>
						</FadeContent>
					</a>
				</li>

				<li className={styles.member}>
					<a
						href='https://x.com/0xRabit'
						target='_blank'
						rel='noreferrer'
						className={styles.link}
					>
						<FadeContent>
							<AnimatedContent
								distance={150}
								direction='vertical'
								reverse={false}
								duration={1.2}
								ease='bounce.out'
								initialOpacity={0.2}
								animateOpacity
								scale={1.1}
								threshold={0.2}
								delay={0.7}
							>
								<img className={styles.photo} src={fourth} />
								<div className={styles.memberInfo}>
									<h3 className={styles.name}>Elisalim</h3>
									<p className={styles.role}>Team / Mod</p>
								</div>
							</AnimatedContent>
						</FadeContent>
					</a>
				</li>
			</ul>
		</section>
	)
}
export default OurTeam
