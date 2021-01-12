This is a LinkMap: A 2D layout of links, controlled by a wiki.

Click the 'help icon' (question mark) for a brief description of the functionality and read the following examples.

[Minimum description length principle for autoencoders 93 Hinton](http://www.cs.toronto.edu/~hinton/absps/cvq.pdf)<!---94|508|darkorange-->
The 'minimum description length principle' for a communication channel tries to minimize the combined size of the 'code' (latent variables) plus the description of the deviation of the output plus the specification of the decoder. They apply this to autoencoders.

[Code: Tensorflow Transformer](https://www.tensorflow.org/tutorials/text/transformer)<!---103|844|royalblue-->
Tutorial on the tensorflow website, for a full-blown transformer model (and language translation as an example). Each step nicely explained.

[Bayesian networks 15 Gal](https://arxiv.org/abs/1506.02158)<!---701|816|darkorange-->
Introducing networks that deal with small amounts of data more robustly and can quantify their uncertainty. Conceptually works with a probability distribution over the weights. In practice, uses dropout.

[RL for Atari video games 15 Mnih](https://www.nature.com/articles/nature14236)<!--933|554|darkorange-->

[AlphaGo 16 Silver](https://www.nature.com/articles/nature16961)<!--1209|554|darkorange-->

[AlphaGoZero 17 Silver](https://www.nature.com/articles/nature24270)<!--931|589|darkorange-->

[AlphaZero 17 Silver](https://arxiv.org/abs/1712.01815v1)<!--1121|586|darkorange-->

[AlphaStar 19 Vinyals](https://www.nature.com/articles/s41586-019-1724-z)<!--1296|586|darkorange-->

[Curriculum learning 09 Bengio](http://ronan.collobert.com/pub/matos/2009_curriculum_icml.pdf)<!--1020|671|darkorange-->
The technique of first learning simple tasks and then gradually increasing the complexity.

#[Machine Learning Classics]()<darkgreen><!---165|-88|522|125|lemonchiffon-->

[Visual receptive filters from learning sparse features 96 Field](https://www.nature.com/articles/381607a0)<!--21|99|darkorange-->
Shows that enforcing sparsity helps to turn the lowest-layer filters of an image recognition network into something resembling what is found in the human visual cortex (Gabor-type filters).

[Review: Neural Networks 89 Hinton](http://www.cs.toronto.edu/~fritz/absps/clp.pdf)<!--19|62|gray-->
"Connectionist Learning Procedures". This review covers the state of the art in 1989, including backpropagation, Hopfield models, Boltzmann machines, reinforcement learning, a first mention of autoencoders (self-supervision), some remarks on mutual information, and much more. Marvellous!


#[Backpropagation and Gradient Descent]()<cadetblue><!---1146|168|520|251|beige-->

[Original backpropagation algorithm 76 Linnainmaa](https://link.springer.com/article/10.1007/BF01931367)<!--21|20|darkorange-->
"Taylor expansion of the accumulated rounding error". Discusses automatic differentiation. Not yet applied to neural networks.

[Backpropagation 85 Hinton](http://www.cs.utoronto.ca/~hinton/absps/naturebp.pdf)<!--21|56|darkorange-->
Rumelhart, Hinton, Williams. The famous introduction of backpropagation for neural networks. Practical applications. Already includes gradient descent with 'momentum'.

[Neural networks approximate arbitrary functions 89 Cybenko](https://link.springer.com/article/10.1007/BF02551274)<!--21|91|darkorange-->
The original proof of the fact that neural networks with at least one hidden layer can approximate arbitrary smooth functions (with sufficiently many neurons).

[Adam 14 Kingma](https://arxiv.org/abs/1412.6980)<!--20|183|darkorange-->
Everyone's favourite adaptive stochastic gradient descent algorithm.

#[Autoencoders]()<!---82|156|397|313-->

[Linear autoencoders 89 Hornik](https://www.sciencedirect.com/science/article/abs/pii/0893608089900142?via%3Dihub)<!--22|20|darkorange-->
They introduce a linear autoencoder and show that it is doing PCA.

[Deep autoencoders & pretraining 06 Hinton](https://www.cs.toronto.edu/~hinton/science.pdf)<!--23|84|darkorange-->
Uses RBM for pretraining, proposes layer-wise pretraining for deep architectures. Science article, with examples from different applications.

[Denoising autoencoders 10 Bengio](http://www.cs.toronto.edu/~larocheh/publications/vincent10a.pdf)<!--23|116|darkorange-->
Adds noise to the input and demands output equals the clean image, which defines their denoising autoencoder. 

[Contractive Autoencoders 11 Bengio](http://www.icml-2011.org/papers/455_icmlpaper.pdf)<!--22|148|darkorange-->
Adds a penalty for (grad f)^2, where f is the encoder.

[Variational Autoencoders 13 Welling](https://arxiv.org/abs/1312.6114)<!--20|179|darkorange-->
Enforces the distribution of latent variables to be a normal Gaussian, such that one can sample from this distribution to generate valid data.

[Review: Representation Learning 12 Bengio](https://arxiv.org/abs/1206.5538)<!--21|245|gray-->
Unsupervised learning of useful features. Covers autoencoders, PCA, sparse coding, distributed representations, and more.


#[Learning to sample]()<cadetblue><!--446|166|426|291|beige-->

[Boltzmann Machines 85 Sejnowski](https://onlinelibrary.wiley.com/doi/abs/10.1207/s15516709cog0901_7)<!--20|20|darkorange-->
The original paper that introduced Boltzmann machines as a tool for learning to sample from an observed probability distribution. Explains the connections to statistical physics and the learning procedure.

[Variational Autoencoders 13 Welling](https://arxiv.org/abs/1312.6114)<!--21|137|darkorange-->
Enforces the distribution of latent variables to be a normal Gaussian, such that one can sample from this distribution to generate valid data.

[Generative Adversarial Networks 14 Goodfellow](https://papers.nips.cc/paper/2014/file/5ca3e9b122f61f8f06494c97b1afccf3-Paper.pdf)<!--21|168|darkorange-->
Introduces GANs, where a generator network tries to fool a discriminator network into believing an image is not fake. Optimizes G and D via min_G max_D { E log(D(x)) + E log(1-D(G(z))) }. Compares with other sampling approaches. Emphasizes this does not need a Markov chain.

#[Convolutional Neural Networks]()<cadetblue><!---583|161|385|327|beige-->

[Neocognitron 80 Fukushima](https://www.cs.princeton.edu/courses/archive/spr08/cos598B/Readings/Fukushima1980.pdf)<!--23|20|darkorange-->
The grandparent of all convolutional neural networks. Far ahead of its time: a multilayer (deep) convolutional structure, with unsupervised learning. Inspired by the human visual cortex.

[Deep CNN for digit recognition 89 LeCun](https://papers.nips.cc/paper/1989/file/53c3bce66e43be4f209556518c2fcb54-Paper.pdf)<!--22|53|darkorange-->
First to use backpropagation to train a multilayer CNN. Here applied to MNIST-style dataset of handwritten digits.

[Convolutional deep belief networks 09 Ng](http://ai.stanford.edu/~ang/papers/icml09-ConvolutionalDeepBeliefNetworks.pdf)<!--24|113|darkorange-->
A deep belief network is several RBMs, stacked on top of each other. Here they introduce the convolutional version.

[ImageNet using Deep CNN 12 Hinton](https://dl.acm.org/doi/10.1145/3065386)<!--23|147|darkorange-->
The summary of the famous deep CNN that won the 2012 ImageNet competition, using ReLU and dropout in a deep CNN.

[Dropout 12 Hinton](https://arxiv.org/abs/1207.0580v1)<!--25|183|darkorange-->
Introduces the technique of dropout, randomly setting neuron values to zero during training. This makes the network more robust and especially prevents overfitting.

[U-Nets 15 Ronneberger](https://arxiv.org/abs/1505.04597)<!--20|226|darkorange-->
Introduces U-Nets, with symmetric down- and upsampling paths and skip-connections. Very efficient for large images. Particularly useful for image transformation and segmentation (where each pixel must receive a label), winning competitions.

[Residual Networks 15 Sun](https://arxiv.org/abs/1512.03385)<!--21|259|darkorange-->
Introduces ResNets: learning not a function but a function minus the identity, and repeating this module. Are able to go to very deep networks for superior ImageNet results (previously really deep nets had more trouble learning than shallower nets).


#[Active Learning]()<cadetblue><!---717|591|567|199|beige-->

[Deep Bayesian active learning 17 Gal](https://arxiv.org/abs/1703.02910)<!--20|66|darkorange-->
Bayesian neural networks allow better to quantify their uncertainty, and this can be used to determine where to sample next in an active learning scenario. They apply this to image learning, e.g. MNIST, using their network to indicate which of the available sample images it wants to receive a label for.

[Review: Bayesian optimization of complex cost functions 10 Freitas](https://arxiv.org/pdf/1012.2599.pdf)<!--21|20|gray-->
A tutorial on using Bayesian optimization and Gaussian processes to quickly find the maximum of a function. Introduces concepts such as the acquisition function. Comments on optimization vs. experimental design vs. active learning.

[Review: Active Learning for Deep Learning 20 Gildenblat](https://jacobgil.github.io/deeplearning/activelearning)<!--20|131|gray-->
(webpage) Nice recent overview of some concepts and articles.


#[Inspecting Neural Networks]()<cadetblue><!---1007|468|256|88|beige-->

[t-SNE 08 Hinton](http://www.cs.toronto.edu/~hinton/absps/tsne.pdf)<!--18|38|darkorange-->
Everyone's favourite nonlinear dimensionality reduction technique for visualization.


#[Time series and natural language processing]()<cadetblue><!---116|598|555|229|beige-->

[Long Short-Term Memory 95 Schmidhuber](http://people.idsia.ch/~juergen/FKI-207-95ocr.pdf)<!--20|20|darkorange-->
The classic paper describing how to get rid of exploding/vanishing gradients in recurrent networks using gated units. (Technical report version; there is a 97 version) 

[(LSTM 97 Schmidhuber)](https://dl.acm.org/doi/10.1162/neco.1997.9.8.1735)<!--330|56|darkorange-->
The 1997 official article

[Attention 14 Bengio](https://arxiv.org/abs/1409.0473v7)<!--21|97|darkorange-->
Introduces an attention mechanism for translation tasks: At each time step, the decoder RNN calculates an attention weight vector that indicates which vicinity of words in the input to focus on. The encoder bi-directional RNN has produced latent variables that indicate the context of each word (preceding and following words). This formed the basis for Transformers.

[Differentiable Neural Computer 16 Graves](https://www.nature.com/articles/nature20101)<!--23|129|darkorange-->
Defining a differentiable neural computer (DNC) with an arbitrary-size external memory of key-value entries that is accessed by read/write heads using queries. Several applications to challenges with graph-type input of variable size. Memory-access similar to the later Transformers.

[Transformers 17 Vaswani](https://arxiv.org/abs/1706.03762)<!--24|161|darkorange-->
"Attention is all you need": Encoder-decoder sequence transduction without recurrence or convolution, but employing attention. Uses queries to extract information from set of key-value pairs, using softmax dot-product attention (using "multiple heads"). Position is encoded via Fourier transform. Memory access similar to the earlier DNC.

#[Graph networks]()<cadetblue><!--471|549|400|231|beige-->

[Graph Networks 05 Lengauer](https://pubs.acs.org/doi/pdf/10.1021/ci049613b)<!--22|20|darkorange-->
Introduces graph neural networks, here in the context of chemistry. Transform a graph into a dynamical system with each node receiving input from neighbors at each time step. (here called "Molecular graph networks")

[Graph Neural Network model 09 Scarselli](https://persagen.com/files/misc/scarselli2009graph.pdf)<!--21|53|darkorange-->
Introduces general graph neural networks.

[Neural message passing 17 Gilmer](https://arxiv.org/abs/1704.01212)<!--20|86|darkorange-->
Emphasizes the 'message passing' aspect of graph neural networks and improves efficiency. Claims very good results on quantum chemistry benchmark problems. Also nice review of recent previous approaches.

[Graph Transformer networks 20 Kim](https://arxiv.org/pdf/1911.06455.pdf)<!--20|123|darkorange-->
Applies the transformer (attention-based) approach to process graphs.

[Review: Graph neural networks 20 Hamilton](https://www.cs.mcgill.ca/~wlh/grl_book/files/GRL_Book-Chapter_5-GNNs.pdf)<!--22|163|gray-->
(chapter in a book) Review of graph neural networks.

#[Reinforcement Learning]()<cadetblue><!--929|167|430|371|beige-->

[Q Learning 92 Watkins](http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=98ECF011CFFA9E02C015F96A1DF3A471?doi=10.1.1.466.7149&rep=rep1&type=pdf)<!--20|20|darkorange-->

[REINFORCE (policy gradient) 92 Williams](https://link.springer.com/article/10.1007/BF00992696)<!--21|54|darkorange-->

[Review: Brief review of deep RL 17 Arulkumaran](https://arxiv.org/abs/1708.05866)<!--21|303|gray-->

Compiled by Florian Marquardt, 2021. 